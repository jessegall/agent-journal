<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Models\Asks\AskHop;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use PhpOption\Option;
use PhpOption\Some;

final class AnsweringAskState extends AgentState
{
    public const string TYPE = 'supervision.answering';

    public function __construct(private readonly bool $isOpen) {}

    public static function reference(AskHop $hop): StateReference
    {
        return new StateReference(self::TYPE, new SubjectReference($hop->id, $hop->version));
    }

    public function isFinished(): bool
    {
        return ! $this->isOpen;
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some('An ask waits for your answer: answer it before other work.');
    }
}
