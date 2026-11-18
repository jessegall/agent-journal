<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\RedirectType;

/**
 * One descriptor operation of a planned command, in source order: the descriptor, what is done to it and its target
 * (a path, a descriptor number, or a here-document's text).
 */
final readonly class PlanRedirect
{
    public function __construct(public int $descriptor, public RedirectType $type, public PlanWord $target) {}

    /**
     * @return array{descriptor: int, type: string, target: list<string|int>}
     */
    public function toArray(): array
    {
        return ['descriptor' => $this->descriptor, 'type' => $this->type->value, 'target' => $this->target->toArray()];
    }

    /**
     * @param  array{descriptor: int, type: string, target: list<string|int>}  $redirect
     */
    public static function fromArray(array $redirect): self
    {
        return new self($redirect['descriptor'], RedirectType::from($redirect['type']), PlanWord::fromArray($redirect['target']));
    }
}
