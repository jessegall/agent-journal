<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The draft reader revision to prove and the real sample runs to replay it over.
 */
final class ProveReaderRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'reader_revision' => ['required', 'string', 'max:64'],
            'runs' => ['required', 'array', 'list', 'min:1', 'max:20'],
            'runs.*' => ['string', 'max:64'],
        ];
    }

    public function readerRevision(): string
    {
        return $this->string('reader_revision')->toString();
    }

    /**
     * @return list<string>
     */
    public function runIds(): array
    {
        /** @var list<string> $runs */
        $runs = $this->validated('runs');

        return $runs;
    }
}
