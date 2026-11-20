<?php

declare(strict_types=1);

namespace App\Supervision\States;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\States\AgentState;
use App\Supervision\Models\AskHop;

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
}
