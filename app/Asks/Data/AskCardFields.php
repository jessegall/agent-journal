<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class AskCardFields
{
    private string $id;

    private string $type;

    private string $body;

    private bool $isOpen;

    private bool $isObligation;

    private bool $hasReply = false;

    private string|null $reply;

    private bool $hasHolderType = false;

    private string|null $holderType;

    private bool $hasHolderId = false;

    private string|null $holderId;

    public function id(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function type(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function body(string $body): self
    {
        $this->body = $body;

        return $this;
    }

    public function isOpen(bool $isOpen): self
    {
        $this->isOpen = $isOpen;

        return $this;
    }

    public function isObligation(bool $isObligation): self
    {
        $this->isObligation = $isObligation;

        return $this;
    }

    public function reply(string|null $reply): self
    {
        $this->reply = $reply;
        $this->hasReply = true;

        return $this;
    }

    public function holderType(string|null $holderType): self
    {
        $this->holderType = $holderType;
        $this->hasHolderType = true;

        return $this;
    }

    public function holderId(string|null $holderId): self
    {
        $this->holderId = $holderId;
        $this->hasHolderId = true;

        return $this;
    }

    public function finish(): AskCard
    {
        if (! isset($this->id)) {
            throw MissingFields::forType(AskCard::class, 'id');
        }

        if (! isset($this->type)) {
            throw MissingFields::forType(AskCard::class, 'type');
        }

        if (! isset($this->body)) {
            throw MissingFields::forType(AskCard::class, 'body');
        }

        if (! isset($this->isOpen)) {
            throw MissingFields::forType(AskCard::class, 'isOpen');
        }

        if (! isset($this->isObligation)) {
            throw MissingFields::forType(AskCard::class, 'isObligation');
        }

        if (! $this->hasReply) {
            throw MissingFields::forType(AskCard::class, 'reply');
        }

        if (! $this->hasHolderType) {
            throw MissingFields::forType(AskCard::class, 'holderType');
        }

        if (! $this->hasHolderId) {
            throw MissingFields::forType(AskCard::class, 'holderId');
        }

        return new AskCard(
            id: $this->id,
            type: $this->type,
            body: $this->body,
            isOpen: $this->isOpen,
            isObligation: $this->isObligation,
            reply: $this->reply,
            holderType: $this->holderType,
            holderId: $this->holderId,
        );
    }
}
