<?php

declare(strict_types=1);

namespace App\Domain\Rules\Api;

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
        public ?RuleView $selected,
        public bool $selectionMissing,
    ) {}
}
