<?php

declare(strict_types=1);

namespace App\Supervision\States\Support;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\References\StateReference;
use App\Hooks\References\SubjectReference;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;
use App\Supervision\Models\AskHop;
use App\Supervision\States\AnsweringAskState;

final readonly class AnsweringAskStates implements StateLoader
{
    public function stateClass(): string
    {
        return AnsweringAskState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $versions = AskHop::activeVersions($references->subjectIds());

        return StateSet::build($references, static function (StateReference $reference) use ($versions) {
            $subject = $reference->subject;
            $isCurrent = $subject instanceof SubjectReference
                && ($versions[$subject->id] ?? null) === $subject->runNumber;

            return new AnsweringAskState($isCurrent);
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::Durable;
    }
}
