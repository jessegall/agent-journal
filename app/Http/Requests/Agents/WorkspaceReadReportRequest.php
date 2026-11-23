<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Values\CommitObservation;
use App\Values\WorkspaceReadReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * An authenticated host's one sample of an actor's checkout for a retained workspace read.
 */
final class WorkspaceReadReportRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'available' => ['required', 'boolean'],
            'dirty' => ['required', 'boolean'],
            'clean' => ['required', 'boolean'],
            'generation' => ['required', 'integer', 'min:0'],
            'binding' => ['sometimes', 'string', 'max:64'],
            'checkout' => ['required_with:binding', 'string', 'max:128'],
            'head' => ['nullable', 'string', 'regex:/^[0-9a-f]{40}([0-9a-f]{24})?$/'],
            'reason' => ['nullable', 'string', 'in:unborn,unavailable'],
        ];
    }

    /**
     * The commit the sample names: none for a sample read for no binding, else its HEAD or the reason there is none.
     */
    public function observedCommit(): CommitObservation
    {
        if (! $this->filled('binding')) {
            return CommitObservation::notRecorded();
        }

        $binding = $this->string('binding')->toString();
        $checkout = $this->string('checkout')->toString();

        if (! $this->filled('head')) {
            return CommitObservation::withoutCommit(
                $binding,
                $checkout,
                $this->string('reason', CommitObservation::UNAVAILABLE)->toString(),
            );
        }

        return CommitObservation::ofHead($binding, $checkout, $this->string('head')->toString());
    }

    public function reference(): WorkspaceReadReference
    {
        return new WorkspaceReadReference((string) $this->route('reference'));
    }
}
