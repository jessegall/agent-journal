<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\CreateMainAgent\CreateMainAgentCommand;
use App\Models\Projects\Project;
use App\Values\ChosenAccount;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A new chat's form: the driver, the model (a name or default) and, optionally, the signed-in account with the sign-in
 * revision the form showed; the agent is made in the local project.
 */
final class CreateMainAgentRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => [
                'required',
                'ulid',
            ],
            'driver' => [
                'required',
                'string',
                'max:32',
            ],
            'model' => [
                'required',
                'string',
                'max:100',
            ],
            'accountId' => [
                'nullable',
                'ulid',
                'required_with:accountRevision',
            ],
            'accountRevision' => [
                'nullable',
                'integer',
                'min:0',
                'required_with:accountId',
            ],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): CreateMainAgentCommand
    {
        return new CreateMainAgentCommand(
            Project::findLocal()->id,
            $this->string('driver')->toString(),
            $this->string('model')->toString(),
            $this->filled('accountId')
                ? new ChosenAccount($this->string('accountId')->lower()->toString(), $this->integer('accountRevision'))
                : null,
        );
    }
}
