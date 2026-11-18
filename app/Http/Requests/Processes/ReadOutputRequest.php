<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\Processes\Enums\OutputStream;
use Illuminate\Foundation\Http\FormRequest;

/**
 * What to read of a run's stored output: its summary, the tail or a search of one part's stream, or its raw bytes.
 */
final class ReadOutputRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'mode' => ['required', 'in:summary,tail,search,raw'],
            'part' => ['nullable', 'integer', 'min:0'],
            'stream' => ['nullable', 'in:stdout,stderr,merged'],
            'tail' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'search' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function mode(): string
    {
        return $this->string('mode')->toString();
    }

    public function partNode(): int
    {
        return $this->integer('part');
    }

    public function stream(): OutputStream
    {
        return $this->filled('stream') ? OutputStream::from($this->string('stream')->toString()) : OutputStream::Stdout;
    }

    public function tailLines(): int
    {
        return $this->filled('tail') ? $this->integer('tail') : 20;
    }

    public function needle(): string
    {
        return $this->string('search')->toString();
    }
}
