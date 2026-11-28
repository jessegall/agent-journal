<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Accounts\Values\CleanupProgress;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The host's report of a cleanup: the generation it was asked in and its two proofs.
 */
final class CleanupReportRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'generation' => [
                'required',
                'integer',
                'min:0',
            ],
            'store_removed' => [
                'required',
                'boolean',
            ],
            'directory_removed' => [
                'required',
                'boolean',
            ],
            'still_bound' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function generation(): int
    {
        return $this->integer('generation');
    }

    public function progress(): CleanupProgress
    {
        return new CleanupProgress(
            $this->boolean('store_removed'),
            $this->boolean('directory_removed'),
            $this->boolean('still_bound'),
        );
    }

    public function targetId(): string
    {
        return (string) ($this->route('account') ?? $this->route('attempt'));
    }
}
