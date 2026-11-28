<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Settings\Enums\ActionMethod;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class LayoutFormDataFields
{
    private ActionMethod $method;

    private string $href;

    /** @var array<string, string|int> */
    private array $fixed = [];

    private bool $isKeyed = false;

    private string|Optional $confirmation;

    private string|Optional $confirmed;

    private LayoutFormData|Optional $undo;

    public function __construct()
    {
        $this->confirmation = new Optional();
        $this->confirmed = new Optional();
        $this->undo = new Optional();
    }

    public function method(ActionMethod $method): self
    {
        $this->method = $method;

        return $this;
    }

    public function href(string $href): self
    {
        $this->href = $href;

        return $this;
    }

    /** @param array<string, string|int> $fixed */
    public function fixed(array $fixed): self
    {
        $this->fixed = $fixed;

        return $this;
    }

    public function isKeyed(bool $isKeyed): self
    {
        $this->isKeyed = $isKeyed;

        return $this;
    }

    public function confirmation(string|Optional $confirmation): self
    {
        $this->confirmation = $confirmation;

        return $this;
    }

    public function confirmed(string|Optional $confirmed): self
    {
        $this->confirmed = $confirmed;

        return $this;
    }

    public function undo(LayoutFormData|Optional $undo): self
    {
        $this->undo = $undo;

        return $this;
    }

    public function finish(): LayoutFormData
    {
        if (! isset($this->method)) {
            throw MissingFields::forType(LayoutFormData::class, 'method');
        }

        if (! isset($this->href)) {
            throw MissingFields::forType(LayoutFormData::class, 'href');
        }

        return new LayoutFormData(
            method: $this->method,
            href: $this->href,
            fixed: $this->fixed,
            isKeyed: $this->isKeyed,
            confirmation: $this->confirmation,
            confirmed: $this->confirmed,
            undo: $this->undo,
        );
    }
}
