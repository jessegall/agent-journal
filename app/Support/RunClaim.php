<?php

declare(strict_types=1);

namespace App\Support;

/**
 * An actor's claim on a run and the assignments it stands on: the claim no longer holds once any of them ends.
 */
final readonly class RunClaim
{
    /**
     * @param  list<string>  $standsOn  the ids of the work or seat assignments the claim was proved by
     */
    public function __construct(public AssignmentReference $claim, public array $standsOn) {}

    /**
     * The claim's own assignment id and the ids it stands on.
     *
     * @return list<string>
     */
    public function assignmentIds(): array
    {
        return [
            $this->claim->id,
            ...$this->standsOn,
        ];
    }
}
