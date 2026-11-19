<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * What the host saw after carrying out one round of the main agent: the stable screen after it, its rows redacted,
 * whether the round's proof showed on it, and the label helper's refusal when a choose or confirm was refused.
 */
final readonly class NavigationRoundReport
{
    /**
     * @param  list<string>  $rows
     * @param  list<MenuStep>  $steps
     */
    public function __construct(
        public array $rows,
        public int|null $highlight,
        public int $generation,
        public bool $proofSeen,
        public string|null $refusal,
        public array $steps = [],
    ) {}

    public function screen(): NavigationScreen
    {
        return new NavigationScreen($this->rows, $this->highlight, $this->generation);
    }
}
