<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A viewer asks for the frame of the agent's terminal after the one they hold, named by its epoch and sequence, through
 * one read interest, or names the open request that opened it to learn its id; the first ask holds none.
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
            'interest' => ['sometimes', 'string', 'max:64'],
            'request' => ['sometimes', 'string', 'max:64'],
        ];
    }

    public function heldEpoch(): string
    {
        return $this->string('epoch')->toString();
    }

    public function heldSequence(): int
    {
        return $this->integer('after');
    }

    public function namesInterest(): bool
    {
        return $this->has('interest');
    }

    public function namesOpenRequest(): bool
    {
        return $this->has('request');
    }

    public function readInterestId(): string
    {
        return $this->string('interest')->toString();
    }

    public function openRequestId(): string
    {
        return $this->string('request')->toString();
    }

    public function agentId(): string
    {
        return strtolower((string) $this->route('agent'));
    }
}
