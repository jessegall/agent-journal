<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

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
        ];
    }

    public function reference(): WorkspaceReadReference
    {
        return new WorkspaceReadReference((string) $this->route('reference'));
    }
}
