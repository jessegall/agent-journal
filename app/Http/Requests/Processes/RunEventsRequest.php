<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\Processes\Values\RunEvent;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A batch of numbered events from a run's supervisor, with the run's event key.
 */
final class RunEventsRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'size:64'],
            'events' => ['required', 'array', 'max:500'],
            'events.*.sequence' => ['required', 'integer', 'min:1'],
            'events.*.type' => ['required', 'string'],
            'events.*.part' => ['nullable', 'array'],
            'events.*.details' => ['present', 'array'],
        ];
    }

    public function eventKey(): string
    {
        return $this->string('key')->toString();
    }

    /**
     * @return list<RunEvent>
     */
    public function events(): array
    {
        return array_values(array_map(RunEvent::fromArray(...), $this->array('events')));
    }
}
