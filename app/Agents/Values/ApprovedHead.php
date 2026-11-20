<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Actors\Support\ActorIdentity;
use App\Records\Support\RecordIdentity;

/**
 * What an admitted merge may publish: the work and its certificate, the target branch, the reviewed base and the
 * exact reviewed head under its imported ref, the approval it rests on, and the actor, ask and version that admitted
 * it.
 */
final readonly class ApprovedHead
{
    public function __construct(
        public RecordIdentity $work,
        public string $certificate,
        public string $targetBranch,
        public string $base,
        public string $head,
        public string $importRef,
        public ReviewDecisionReference $decision,
        public ActorIdentity $admitted,
        public string $askId,
        public int $version,
    ) {}
}
