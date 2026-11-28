<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class CreationDialogFields
{
    private string $key;

    private string $title;

    private string $confirmation;

    private string $sendLabel;

    private string|Optional $guidedNoun;

    private string $plainWay = 'Write it yourself';

    private string $guidedWay = 'Write it with an agent';

    private bool $waysInHeader = false;

    public function __construct()
    {
        $this->guidedNoun = new Optional();
    }

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
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

    public function sendLabel(string $sendLabel): self
    {
        $this->sendLabel = $sendLabel;

        return $this;
    }

    public function guidedNoun(string|Optional $guidedNoun): self
    {
        $this->guidedNoun = $guidedNoun;

        return $this;
    }

    public function plainWay(string $plainWay): self
    {
        $this->plainWay = $plainWay;

        return $this;
    }

    public function guidedWay(string $guidedWay): self
    {
        $this->guidedWay = $guidedWay;

        return $this;
    }

    public function waysInHeader(bool $waysInHeader): self
    {
        $this->waysInHeader = $waysInHeader;

        return $this;
    }

    public function finish(): CreationDialog
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(CreationDialog::class, 'key');
        }

        if (! isset($this->title)) {
            throw MissingFields::forType(CreationDialog::class, 'title');
        }

        if (! isset($this->confirmation)) {
            throw MissingFields::forType(CreationDialog::class, 'confirmation');
        }

        if (! isset($this->sendLabel)) {
            throw MissingFields::forType(CreationDialog::class, 'sendLabel');
        }

        return new CreationDialog(
            key: $this->key,
            title: $this->title,
            confirmation: $this->confirmation,
            sendLabel: $this->sendLabel,
            guidedNoun: $this->guidedNoun,
            plainWay: $this->plainWay,
            guidedWay: $this->guidedWay,
            waysInHeader: $this->waysInHeader,
        );
    }
}
