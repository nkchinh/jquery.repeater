import $ from 'jquery';
import {
	pluck, foreach, map, extend, last, filter, identity,
} from './lib';

$.fn.repeaterVal = function () {
	const parse = function (raw) {
		const parsed = [];

		foreach(raw, (val, key) => {
			let parsedKey = [];
			if (key !== 'undefined') {
				parsedKey.push(key.match(/^[^[]*/)[0]);
				parsedKey = parsedKey.concat(map(
					key.match(/\[[^\]]*\]/g),
					bracketed => bracketed.replace(/[[\]]/g, ''),
				));

				parsed.push({
					val,
					key: parsedKey,
				});
			}
		});

		return parsed;
	};

	function build(parsed) {
		if (
			parsed.length === 1
				&&	(parsed[0].key.length === 0 || parsed[0].key.length === 1)
				&& !parsed[0].key[0]
		) {
			return parsed[0].val;
		}

		foreach(parsed, (p) => {
			// eslint-disable-next-line no-param-reassign
			p.head = p.key.shift();
		});

		const grouped = (function () {
			const mGrouped = {};

			foreach(parsed, (p) => {
				if (!mGrouped[p.head]) {
					mGrouped[p.head] = [];
				}
				mGrouped[p.head].push(p);
			});

			return mGrouped;
		}());

		let built;

		if (/^[0-9]+$/.test(parsed[0].head)) {
			built = [];
			foreach(grouped, (group) => {
				built.push(build(group));
			});
		} else {
			built = {};
			foreach(grouped, (group, key) => {
				built[key] = build(group);
			});
		}

		return built;
	}

	return build(parse($(this).inputVal()));
};

$.fn.repeater = function (fig) {
	// eslint-disable-next-line no-param-reassign
	fig = fig || {};

	let setList;

	$(this).each(function () {
		const $self = $(this);

		const show = fig.show || function () {
			$(this).show();
		};

		const hide = fig.hide || function (removeElement) {
			removeElement();
		};

		const $list = $self.find('[data-repeater-list]').first();

		const $filterNested = function ($items, repeaters) {
			return $items.filter(function () {
				return repeaters
					? $(this).closest(
						pluck(repeaters, 'selector').join(','),
					).length === 0 : true;
			});
		};

		const $items = function () {
			return $filterNested($list.find('[data-repeater-item]'), fig.repeaters);
		};

		const $itemTemplate = $list.find('[data-repeater-item]')
			.first().clone().hide();

		const $firstDeleteButton = $filterNested(
			$filterNested($(this).find('[data-repeater-item]'), fig.repeaters)
				.first().find('[data-repeater-delete]'),
			fig.repeaters,
		);

		if (fig.isFirstItemUndeletable && $firstDeleteButton) {
			$firstDeleteButton.remove();
		}

		const getGroupName = function () {
			const groupName = $list.data('repeater-list');
			return fig.$parent
				? `${fig.$parent.data('item-name')}[${groupName}]`
				: groupName;
		};

		const initNested = function ($listItems) {
			if (fig.repeaters) {
				$listItems.each(function () {
					const $item = $(this);
					foreach(fig.repeaters, (nestedFig) => {
						$item.find(nestedFig.selector).repeater(extend(
							nestedFig, { $parent: $item },
						));
					});
				});
			}
		};

		const $foreachRepeaterInItem = function (repeaters, $item, cb) {
			if (repeaters) {
				foreach(repeaters, (nestedFig) => {
					cb.call($item.find(nestedFig.selector)[0], nestedFig);
				});
			}
		};

		function setIndexes($its, groupName, repeaters) {
			$its.each(function (index) {
				const $item = $(this);
				$item.data('item-name', `${groupName}[${index}]`);
				$filterNested($item.find('[name]'), repeaters)
					.each(function () {
						const $input = $(this);
						// match non empty brackets (ex: "[foo]")
						const matches = $input.attr('name').match(/\[[^\]]+\]/g);

						const name = matches
						// strip "[" and "]" characters
							? last(matches).replace(/\[|\]/g, '')
							: $input.attr('name');


						const newName = `${groupName}[${index}][${name}]${
							$input.is(':checkbox') || $input.attr('multiple') ? '[]' : ''}`;

						$input.attr('name', newName);

						$foreachRepeaterInItem(repeaters, $item, function (nestedFig) {
							const $repeater = $(this);
							setIndexes(
								$filterNested($repeater.find('[data-repeater-item]'), nestedFig.repeaters || []),
								`${groupName}[${index}]`
										+ `[${$repeater.find('[data-repeater-list]').first().data('repeater-list')}]`,
								nestedFig.repeaters,
							);
						});
					});
			});

			$list.find('input[name][checked]')
				.removeAttr('checked')
				.prop('checked', true);
		}

		setIndexes($items(), getGroupName(), fig.repeaters);
		initNested($items());
		if (fig.initEmpty) {
			$items().remove();
		}

		if (fig.ready) {
			fig.ready(() => {
				setIndexes($items(), getGroupName(), fig.repeaters);
			});
		}

		const appendItem = (function () {
			function setItemsValues($item, data, repeaters) {
				if (data || fig.defaultValues) {
					const inputNames = {};
					$filterNested($item.find('[name]'), repeaters).each(function () {
						const key = $(this).attr('name').match(/\[([^\]]*)(\]|\]\[\])$/)[1];
						inputNames[key] = $(this).attr('name');
					});

					$item.inputVal(map(
						filter(data || fig.defaultValues, (val, name) => inputNames[name]),
						identity,
						name => inputNames[name],
					));
				}


				$foreachRepeaterInItem(repeaters, $item, function (nestedFig) {
					const $repeater = $(this);
					$filterNested(
						$repeater.find('[data-repeater-item]'),
						nestedFig.repeaters,
					)
						.each(function () {
							const fieldName = $repeater.find('[data-repeater-list]').data('repeater-list');
							if (data && data[fieldName]) {
								const $template = $(this).clone();
								$repeater.find('[data-repeater-item]').remove();
								foreach(data[fieldName], (d) => {
									const $itm = $template.clone();
									setItemsValues(
										$itm,
										d,
										nestedFig.repeaters || [],
									);
									$repeater.find('[data-repeater-list]').append($itm);
								});
							} else {
								setItemsValues(
									$(this),
									nestedFig.defaultValues,
									nestedFig.repeaters || [],
								);
							}
						});
				});
			}

			return function ($item, data) {
				$list.append($item);
				setIndexes($items(), getGroupName(), fig.repeaters);
				$item.find('[name]').each(function () {
					$(this).inputClear();
				});
				setItemsValues($item, data || fig.defaultValues, fig.repeaters);
			};
		}());

		const addItem = function (data) {
			const $item = $itemTemplate.clone();
			appendItem($item, data);
			if (fig.repeaters) {
				initNested($item);
			}
			show.call($item.get(0));
		};

		setList = function (rows) {
			$items().remove();
			foreach(rows, addItem);
		};

		$filterNested($self.find('[data-repeater-create]'), fig.repeaters)
			.click(() => {
				addItem();
			});

		$list.on('click', '[data-repeater-delete]', function () {
			const self = $(this).closest('[data-repeater-item]').get(0);
			hide.call(self, () => {
				$(self).remove();
				setIndexes($items(), getGroupName(), fig.repeaters);
			});
		});
	});

	this.setList = setList;

	return this;
};
