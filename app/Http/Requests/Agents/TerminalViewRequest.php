<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\CloseTerminalView\CloseTerminalViewCommand;
use App\Agents\Commands\OpenTerminalView\OpenTerminalViewCommand;
use App\Agents\Commands\RenewTerminalView\RenewTerminalViewCommand;
use App\Agents\Models\TerminalView;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A viewer opens a read interest in the agent's terminal named in the route, by an open request id and at an interval
 * they may choose, or renews or closes one interest by its id; nothing in it reaches the driver.
 */
final class TerminalViewRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'intervalMs' => ['sometimes', 'integer'],
            'requestId' => ['required_without:interest', 'string', 'max:64'],
            'interest' => ['required_without:requestId', 'string', 'max:64'],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function openCommand(): OpenTerminalViewCommand
    {
        return new OpenTerminalViewCommand($this->agentId(), $this->string('requestId')->toString(), $this->intervalMs());
    }

    public function renewCommand(): RenewTerminalViewCommand
    {
        return new RenewTerminalViewCommand($this->agentId(), $this->readInterestId());
    }

    public function closeCommand(): CloseTerminalViewCommand
    {
        return new CloseTerminalViewCommand($this->agentId(), $this->readInterestId());
    }

    public function agentId(): string
    {
        return strtolower((string) $this->route('agent'));
    }

    private function readInterestId(): string
    {
        return $this->string('interest')->toString();
    }

    private function intervalMs(): int
    {
        return $this->integer('intervalMs', TerminalView::DEFAULT_INTERVAL_MS);
    }
}
