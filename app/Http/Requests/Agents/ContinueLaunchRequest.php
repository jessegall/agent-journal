<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\ContinueLaunch;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A person continues the launch of the session the route names, for the agent it names.
 */
final class ContinueLaunchRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['agent_id' => ['required', 'string', 'max:64']];
    }

    public function command(): ContinueLaunch
    {
        $sessionId = strtolower((string) $this->route('session'));

        return new ContinueLaunch($sessionId, $this->string('agent_id')->lower()->toString());
    }
}
