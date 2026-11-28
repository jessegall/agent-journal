<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A File window's own query: the path of the file it shows, from the project's root; none when no file is chosen. A
 * path longer than a project read takes is refused by the read itself.
 */
final class FileWindowRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['path' => [
            'nullable',
            'string',
        ]];
    }

    public function path(): string
    {
        return $this->string('path')->toString();
    }
}
