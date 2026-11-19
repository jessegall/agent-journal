<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Communication\Commands\ReleaseMessageClaim;
use Illuminate\Foundation\Http\FormRequest;

final class ReleaseMessageClaimRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'messageId' => ['required', 'string', 'size:26'],
            'claimId' => ['required', 'string', 'size:26'],
            'holderType' => ['required', 'string', 'max:16'],
            'holderId' => ['required', 'string', 'size:26'],
            'reason' => ['required', 'string', 'max:2000'],
        ];
    }

    public function command(): ReleaseMessageClaim
    {
        return new ReleaseMessageClaim(
            $this->string('messageId')->toString(),
            $this->expectedClaim(),
            $this->string('reason')->toString(),
        );
    }

    private function expectedClaim(): AssignmentReference
    {
        $holder = new AssigneeIdentity($this->string('holderType')->toString(), $this->string('holderId')->toString());

        return new AssignmentReference($this->string('claimId')->toString(), $holder);
    }
}
