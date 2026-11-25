<?php

declare(strict_types=1);

namespace App\Support\Links;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Records\RecordProvider;
use App\Data\Pages\RecordCard;
use App\Enums\Agents\AccessType;
use App\Models\Projects\ProjectFile;
use App\Policies\ProjectFilesPolicy;
use App\Support\ReadBuilder;
use Illuminate\Database\Eloquent\Model;

/**
 * A connected project's files as records comments point at, readable by the owner alone.
 */
final readonly class ProjectFileLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<ProjectFile>
     */
    use ProvidesModelRecords;

    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function referenceWord(): string
    {
        return 'file';
    }

    protected function linkType(): string
    {
        return ProjectFile::linkType();
    }

    protected function readableRecords(): ReadBuilder
    {
        $granted = $this->authorizer->filterActions(ProjectFilesPolicy::class, ProjectFile::class, [AccessType::Read]);

        return ProjectFile::query()->when($granted === [], fn ($files) => $files->whereRaw('false'));
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => ProjectFile::linkType(),
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "file {$record->number}",
            'title' => $record->path,
            'abstract' => null,
            'route' => null,
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return false;
    }
}
