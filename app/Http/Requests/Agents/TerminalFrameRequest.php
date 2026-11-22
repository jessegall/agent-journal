<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Support\HeldFrame;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A viewer asks for the frame of the agent's terminal after the one they hold, named by its epoch, stream and
 * sequence, through one read interest; the first ask holds none.
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
            'stream' => ['sometimes', 'string', 'max:64'],
            'interest' => ['sometimes', 'string', 'max:64'],
        ];
    }

    /**
     * The frame the view holds, read through the interest the request names.
     */
    public function heldFrame(): HeldFrame
    {
        return new HeldFrame(
            $this->readInterestId(),
            $this->string('epoch')->toString(),
            $this->string('stream')->toString(),
            $this->integer('after'),
        );
    }

    private function readInterestId(): string
    {
        return $this->string('interest')->toString();
    }

    public function agentId(): string
    {
        return strtolower((string) $this->route('agent'));
    }
}
