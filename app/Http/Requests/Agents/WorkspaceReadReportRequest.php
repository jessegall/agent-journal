<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Values\CommitObservation;
use App\Agents\Values\WorkspaceReadReference;
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
            'version' => ['sometimes', 'integer', 'in:1,2'],
            'binding' => ['required_if:version,2', 'string', 'max:64'],
            'checkout' => ['required_if:version,2', 'string', 'max:128'],
            'head' => ['nullable', 'string', 'regex:/^[0-9a-f]{40}([0-9a-f]{24})?$/'],
            'reason' => ['nullable', 'string', 'in:unborn,unavailable'],
        ];
    }

    /**
     * The commit the sample names: none for a version 1 report, else its HEAD or the reason there is none.
     */
    public function commit(): CommitObservation
    {
        if ($this->integer('version', 1) !== 2) {
            return CommitObservation::versionOne();
        }

        $binding = $this->string('binding')->toString();
        $checkout = $this->string('checkout')->toString();

        if (! $this->filled('head')) {
            return CommitObservation::without($binding, $checkout, $this->string('reason', CommitObservation::UNAVAILABLE)->toString());
        }

        return CommitObservation::ofHead($binding, $checkout, $this->string('head')->toString());
    }

    public function reference(): WorkspaceReadReference
    {
        return new WorkspaceReadReference((string) $this->route('reference'));
    }
}
