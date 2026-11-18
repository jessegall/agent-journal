<?php

declare(strict_types=1);

namespace Domain\Rules\Api;

use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * One page of rules, newest first, with the page the domain settled on, and the selected rule: absent when none was
 * asked for, missing when it does not exist.
 */
final readonly class RuleList
{
    /**
     * @param  list<RuleView>  $rules
     */
    public function __construct(
        public array $rules,
        public int $page,
        public int $lastPage,
        public int $total,
        public RuleView|null $selected,
        public bool $selectionMissing,
    ) {}

    /**
     * The selected rule, when one is selected and readable.
     *
     * @return Option<RuleView>
     */
    public function selection(): Option
    {
        return $this->selected === null ? None::create() : Some::create($this->selected);
    }
}
