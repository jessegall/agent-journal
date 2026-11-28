<?php

declare(strict_types=1);

namespace App\Terminals\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class TerminalWindowDataFields
{
    private string $agentId;

    public function agentId(string $agentId): self
    {
        $this->agentId = $agentId;

        return $this;
    }

    public function finish(): TerminalWindowData
    {
        if (! isset($this->agentId)) {
            throw MissingFields::forType(TerminalWindowData::class, 'agentId');
        }

        return new TerminalWindowData(
            agentId: $this->agentId,
        );
    }
}
