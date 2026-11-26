<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\CommandRules\Values\OwnerApproval;
use App\CommandRules\Values\ReaderApproval;
use Illuminate\Foundation\Http\FormRequest;

/**
 * An owner's review of a proposal or a rule: the revisions they read, the reader and proof of a check, the earlier
 * revision to restore, a request id for a retry, and their reason.
 */
final class ReviewRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'expected_revision' => ['nullable', 'integer', 'min:0'],
            'expected_active_revision' => ['nullable', 'integer', 'min:0'],
            'reader_revision' => ['nullable', 'string', 'max:64', 'required_with:proof'],
            'proof' => ['nullable', 'string', 'max:64', 'required_with:reader_revision'],
            'from_revision' => ['nullable', 'integer', 'min:1'],
            'request_id' => ['nullable', 'string', 'max:255'],
            'reason' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function approval(): OwnerApproval
    {
        $readers = $this->filled('proof')
            ? [new ReaderApproval($this->string('reader_revision')->toString(), $this->string('proof')->toString())]
            : [];

        return new OwnerApproval(
            $this->expectedRevision(),
            $this->integer('expected_active_revision'),
            $readers,
            $this->reason(),
        );
    }

    public function expectedRevision(): int
    {
        return $this->integer('expected_revision');
    }

    public function fromRevision(): int
    {
        return $this->integer('from_revision');
    }

    public function requestKey(): string
    {
        return $this->string('request_id')->toString();
    }

    public function reason(): string
    {
        return $this->string('reason')->toString();
    }
}
