<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Spatie\LaravelData\Optional;

final class LayoutActionDataFields
{
    /** @var array<string, string> */
    private array $query = [];

    private string|Optional $href;

    private string|Optional $reason;

    private bool $submits = false;

    private bool $appends = false;

    public function __construct()
    {
        $this->href = new Optional();
        $this->reason = new Optional();
    }

    /** @param array<string, string> $query */
    public function query(array $query): self
    {
        $this->query = $query;

        return $this;
    }

    public function href(string|Optional $href): self
    {
        $this->href = $href;

        return $this;
    }

    public function reason(string|Optional $reason): self
    {
        $this->reason = $reason;

        return $this;
    }

    public function submits(bool $submits): self
    {
        $this->submits = $submits;

        return $this;
    }

    public function appends(bool $appends): self
    {
        $this->appends = $appends;

        return $this;
    }

    public function finish(): LayoutActionData
    {

        return new LayoutActionData(
            query: $this->query,
            href: $this->href,
            reason: $this->reason,
            submits: $this->submits,
            appends: $this->appends,
        );
    }
}
