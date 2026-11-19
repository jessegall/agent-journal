<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\CloseTerminalView;
use App\Agents\Commands\OpenTerminalView;
use App\Agents\Commands\RenewTerminalView;
use App\Agents\Models\TerminalView;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A viewer opens, renews or closes their view of the agent's terminal named in the route, at an interval they may
 * choose; nothing in it reaches the program.
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
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function openCommand(): OpenTerminalView
    {
        return new OpenTerminalView($this->agentId(), $this->intervalMs());
    }

    public function renewCommand(): RenewTerminalView
    {
        return new RenewTerminalView($this->agentId(), $this->intervalMs());
    }

    public function closeCommand(): CloseTerminalView
    {
        return new CloseTerminalView($this->agentId());
    }

    public function agentId(): string
    {
        return strtolower((string) $this->route('agent'));
    }

    private function intervalMs(): int
    {
        return $this->integer('intervalMs', TerminalView::DEFAULT_INTERVAL_MS);
    }
}
