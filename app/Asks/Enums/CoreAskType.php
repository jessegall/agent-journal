<?php

declare(strict_types=1);

namespace App\Asks\Enums;

use App\Asks\Values\SubjectType;
use App\Bus\Contracts\Command;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Values\AskTypeKey;

enum CoreAskType: string
{
    case Question = 'question';
    case Stuck = 'stuck';

    public function key(): AskTypeKey
    {
        return AskTypeKey::of($this->value);
    }

    /**
     * The command whose admission an answer to an ask of this type needs.
     *
     * @return class-string<Command<mixed>>
     */
    public function requiredCommand(): string
    {
        return SendMessageCommand::class;
    }

    public function subject(): SubjectType
    {
        return new SubjectType('question', isWorkRequired: false);
    }

    public function minutes(): int
    {
        return 15;
    }

    /**
     * The keys of the core ask types, which a holder's queue serves before the types profiles add.
     *
     * @return list<string>
     */
    public static function urgentKeys(): array
    {
        return array_column(self::cases(), 'value');
    }
}
