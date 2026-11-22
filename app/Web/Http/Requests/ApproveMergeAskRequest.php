<?php

declare(strict_types=1);

namespace App\Web\Http\Requests;

use App\Agents\Commands\MergeReviewedWork;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Approving a merge ask's merge from its page: the approval it names and the ask version the page showed.
 */
final class ApproveMergeAskRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'decisionId' => ['required', 'string', 'size:26'],
            'expectedVersion' => ['required', 'integer', 'min:0'],
        ];
    }

    public function command(): MergeReviewedWork
    {
        return new MergeReviewedWork($this->string('decisionId')->toString(), $this->integer('expectedVersion'));
    }
}
