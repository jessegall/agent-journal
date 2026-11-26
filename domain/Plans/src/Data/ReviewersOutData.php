<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Data;

/**
 * The reviewing agent's own value: the ids of the helpers it sent to review its plan that have not reported back.
 */
final class ReviewersOutData extends Data
{
    /**
     * @param  list<string>  $agentIds
     */
    public function __construct(public readonly array $agentIds = []) {}

    public function adding(string $agentId): self
    {
        return new self(array_values(array_unique([...$this->agentIds, $agentId])));
    }

    public function removing(string $agentId): self
    {
        return new self(array_values(array_diff($this->agentIds, [$agentId])));
    }
}
