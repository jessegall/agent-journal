<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use App\Connections\ConnectionCursors;
use Illuminate\Foundation\Http\FormRequest;

final class ConnectProjectRequest extends FormRequest
{
    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'attempts' => ['nullable', 'string', 'max:2048'],
            'bindings' => ['nullable', 'string', 'max:2048'],
        ];
    }

    public function cursors(): ConnectionCursors
    {
        $attempts = $this->string('attempts')->toString();
        $bindings = $this->string('bindings')->toString();

        return new ConnectionCursors(
            attempts: $attempts === '' ? null : $attempts,
            bindings: $bindings === '' ? null : $bindings,
        );
    }
}
