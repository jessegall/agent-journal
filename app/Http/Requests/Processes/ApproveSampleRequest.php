<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * An owner's approval of one evidence sample: the declaration revision reviewed and the digest of the exact line.
 */
final class ApproveSampleRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'expected_revision' => [
                'required',
                'integer',
                'min:1',
            ],
            'command_digest' => [
                'required',
                'string',
                'size:64',
            ],
        ];
    }

    public function expectedRevision(): int
    {
        return $this->integer('expected_revision');
    }

    public function commandDigest(): string
    {
        return $this->string('command_digest')->toString();
    }
}
