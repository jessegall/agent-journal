<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Enums\PartType;
use App\Exceptions\DockCardInvalid;
use App\Support\Cards\Contracts\DockPart;

/**
 * A few messages of a conversation the viewer may read, in order, with the page that opens it.
 */
final readonly class MessagesExcerpt implements DockPart
{
    public const int MESSAGE_LIMIT = 5;

    public string $key;

    /**
     * @var list<ExcerptMessage>
     */
    public array $messages;

    /**
     * @param  list<ExcerptMessage>  $messages
     */
    public function __construct(string $key, array $messages, public DockDestination|null $open = null)
    {
        PartKey::assertGiven($key, PartType::MessagesExcerpt);

        if (count($messages) > self::MESSAGE_LIMIT) {
            throw DockCardInvalid::tooMuchText($key, self::MESSAGE_LIMIT);
        }

        $this->key = $key;
        $this->messages = $messages;
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::MessagesExcerpt;
    }

    public function children(): array
    {
        return [];
    }
}
