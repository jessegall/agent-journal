<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Asks\Enums\AskResult;
use App\Web\Creation\Exceptions\MissingFields;

final class AskDetailFields
{
    private AskCard $card;

    private int $version;

    private AskResult $result;

    private string $resultLabel;

    public function card(AskCard $card): self
    {
        $this->card = $card;

        return $this;
    }

    public function version(int $version): self
    {
        $this->version = $version;

        return $this;
    }

    public function result(AskResult $result): self
    {
        $this->result = $result;

        return $this;
    }

    public function resultLabel(string $label): self
    {
        $this->resultLabel = $label;

        return $this;
    }

    public function finish(): AskDetail
    {
        if (! isset($this->card)) {
            throw MissingFields::forType(AskDetail::class, 'card');
        }

        if (! isset($this->version)) {
            throw MissingFields::forType(AskDetail::class, 'version');
        }

        if (! isset($this->result)) {
            throw MissingFields::forType(AskDetail::class, 'result');
        }

        if (! isset($this->resultLabel)) {
            throw MissingFields::forType(AskDetail::class, 'resultLabel');
        }

        return new AskDetail(
            card: $this->card,
            version: $this->version,
            result: $this->result,
            resultLabel: $this->resultLabel,
        );
    }
}
