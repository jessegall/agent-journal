<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Commands\Projects\NotifyProjectRead\NotifyProjectReadCommand;
use App\Data\Connections\ProjectEntryData;
use App\Enums\Projects\ProjectReadFailure;
use App\Values\ProjectFileText;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A host's answer to a read of its project: a folder's entries, a file's text, or why it could not read it.
 */
final class ProjectReadReportRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'entries' => ['sometimes', 'array'],
            'entries.*.name' => ['required', 'string', 'max:255'],
            'entries.*.is_folder' => ['required', 'boolean'],
            'entries.*.size' => ['required', 'integer', 'min:0'],
            'text' => ['nullable', 'string'],
            'digest' => ['nullable', 'string'],
            'size' => ['nullable', 'integer', 'min:0'],
            'truncated' => ['sometimes', 'boolean'],
            'failure' => ['nullable', Rule::enum(ProjectReadFailure::class)],
        ];
    }

    /**
     * The host's answer to the read the route names, as the command that settles it.
     */
    public function command(string $hostId): NotifyProjectReadCommand
    {
        return new NotifyProjectReadCommand(
            $hostId,
            (string) $this->route('read'),
            $this->entries(),
            $this->fileText(),
            $this->boolean('truncated'),
            $this->enum('failure', ProjectReadFailure::class),
        );
    }

    /**
     * @return list<ProjectEntryData>
     */
    private function entries(): array
    {
        $entries = $this->safe()->collect('entries')->all();

        return array_values(ProjectEntryData::collect($entries));
    }

    /**
     * The file's text with its digest and size, or null when the answer holds no text; an empty file's text is ''.
     */
    private function fileText(): ProjectFileText|null
    {
        if (! $this->has(['text', 'digest', 'size'])) {
            return null;
        }

        return new ProjectFileText(
            $this->string('text')->toString(),
            $this->string('digest')->toString(),
            $this->integer('size'),
        );
    }
}
