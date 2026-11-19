<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A viewer asks for the frame of the agent's terminal after the one they hold, named by its epoch and sequence;
 * the first ask holds none.
 */
final class TerminalFrameRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'epoch' => ['sometimes', 'string', 'max:64'],
            'after' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function epoch(): string
    {
        return $this->string('epoch')->toString();
    }

    public function after(): int
    {
        return $this->integer('after');
    }

    public function agentId(): string
    {
        return strtolower((string) $this->route('agent'));
    }
}
