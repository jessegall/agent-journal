<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\Processes\Enums\OutputStream;
use App\Processes\Values\PartKey;
use Illuminate\Foundation\Http\FormRequest;

/**
 * One piece of a part's output from the host, at its offset in the stream, with the run's event key.
 */
final class RunChunkRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'size:64'],
            'part.node' => ['required', 'integer'],
            'part.attempt' => ['required', 'integer', 'min:1'],
            'part.operation' => ['present', 'string'],
            'stream' => ['required', 'in:stdout,stderr,merged'],
            'offset' => ['required', 'integer', 'min:0'],
            'bytes' => ['required', 'string'],
        ];
    }

    public function eventKey(): string
    {
        return $this->string('key')->toString();
    }

    public function part(): PartKey
    {
        return new PartKey(
            $this->integer('part.node'),
            $this->integer('part.attempt'),
            $this->string('part.operation')->toString(),
        );
    }

    public function stream(): OutputStream
    {
        return OutputStream::from($this->string('stream')->toString());
    }

    public function offset(): int
    {
        return $this->integer('offset');
    }

    public function bytes(): string
    {
        return (string) base64_decode($this->string('bytes')->toString(), true);
    }
}
