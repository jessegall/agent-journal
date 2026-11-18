<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\Processes\Enums\ProposalState;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Which proposals of the project to list: those in one state, or all of them.
 */
final class ProposalListRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return ['state' => ['nullable', Rule::enum(ProposalState::class)]];
    }

    /**
     * @return list<ProposalState>
     */
    public function states(): array
    {
        return $this->filled('state') ? [ProposalState::from($this->string('state')->toString())] : ProposalState::cases();
    }
}
