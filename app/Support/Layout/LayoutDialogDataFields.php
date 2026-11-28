<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class LayoutDialogDataFields
{
    private string $title;

    private string $confirmation;

    private LayoutFormData|Optional $undo;

    private string|Optional $guidedNoun;

    private LayoutWaysData|Optional $ways;

    public function __construct()
    {
        $this->undo = new Optional();
        $this->guidedNoun = new Optional();
        $this->ways = new Optional();
    }

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function confirmation(string $confirmation): self
    {
        $this->confirmation = $confirmation;

        return $this;
    }

    public function undo(LayoutFormData|Optional $undo): self
    {
        $this->undo = $undo;

        return $this;
    }

    public function guidedNoun(string|Optional $guidedNoun): self
    {
        $this->guidedNoun = $guidedNoun;

        return $this;
    }

    public function ways(LayoutWaysData|Optional $ways): self
    {
        $this->ways = $ways;

        return $this;
    }

    public function finish(): LayoutDialogData
    {
        if (! isset($this->title)) {
            throw MissingFields::forType(LayoutDialogData::class, 'title');
        }

        if (! isset($this->confirmation)) {
            throw MissingFields::forType(LayoutDialogData::class, 'confirmation');
        }

        return new LayoutDialogData(
            title: $this->title,
            confirmation: $this->confirmation,
            undo: $this->undo,
            guidedNoun: $this->guidedNoun,
            ways: $this->ways,
        );
    }
}
