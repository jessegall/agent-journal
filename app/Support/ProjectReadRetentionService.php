<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ProjectReadState;
use App\Models\Projects\ProjectFile;
use App\Models\Projects\ProjectFileVersion;
use App\Models\Projects\ProjectRead;
use Carbon\CarbonImmutable;

/**
 * Expires the project reads no host answered in time, deletes the settled ones once nobody reuses them, and keeps of
 * each project file only the versions a comment names and the newest few of the rest.
 */
final readonly class ProjectReadRetentionService
{
    public function prune(CarbonImmutable $now): void
    {
        ProjectRead::query()
            ->where('state', ProjectReadState::Pending->value)
            ->where('expires_at', '<', $now)
            ->update(['state' => ProjectReadState::Expired->value]);

        ProjectRead::query()
            ->where('state', '!=', ProjectReadState::Pending->value)
            ->where('updated_at', '<', $now->subMinutes(ProjectRead::KEEP_MINUTES_LIMIT))
            ->delete();

        $newest = ProjectFileVersion::query()
            ->selectRaw('id, row_number() over (partition by project_file_id order by created_at desc, id desc) as place');

        ProjectFileVersion::query()
            ->whereNotExists(fn ($comments) => $comments->from('comments')
                ->where('comments.target_type', ProjectFile::LINK_TYPE)
                ->whereColumn('comments.target_id', 'project_file_versions.project_file_id')
                ->whereColumn('comments.version_id', 'project_file_versions.digest'))
            ->whereNotIn('id', fn ($kept) => $kept->fromSub($newest, 'ranked')
                ->where('place', '<=', ProjectFileVersion::KEPT_UNNAMED_VERSION_LIMIT)
                ->select('id'))
            ->delete();
    }
}
