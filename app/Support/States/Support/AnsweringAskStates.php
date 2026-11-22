<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Enums\SessionTransferType;
use App\Models\AskHop;
use App\Support\Decisions\StateReferences;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use App\Support\States\AnsweringAskState;

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
