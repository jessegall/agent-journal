<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The sign-in runner's ask for an account folder order: the folder, named by its plain account id, and the operation
 * it belongs to, which the same ask sent again repeats.
 */
final class HostFolderRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'folder' => ['required', 'string', 'regex:/^[a-z0-9]+$/'],
            'operation' => ['required', 'string', 'regex:/^[A-Za-z0-9-]{8,64}$/'],
        ];
    }

    public function folder(): string
    {
        return $this->string('folder')->toString();
    }

    public function operation(): string
    {
        return $this->string('operation')->toString();
    }
}
