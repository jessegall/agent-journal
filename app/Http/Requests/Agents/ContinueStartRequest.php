<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Commands\Agents\ContinueStart\ContinueStartCommand;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A user continues the start of the session the route names, for the agent it names.
 */
final class ContinueStartRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['agent_id' => ['required', 'string', 'max:64']];
    }

    public function command(): ContinueStartCommand
    {
        $sessionId = strtolower((string) $this->route('session'));

        return new ContinueStartCommand($sessionId, $this->string('agent_id')->lower()->toString());
    }
}
