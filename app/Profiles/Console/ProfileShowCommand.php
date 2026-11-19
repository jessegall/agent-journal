<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Values\ProfileKey;
use Illuminate\Console\Command;

/**
 * Shows one revision of a profile, the current one unless another is named: type, model, skill lists and instructions.
 */
final class ProfileShowCommand extends Command
{
    protected $signature = 'profile:show {key : The stable key of the profile} {--revision= : An earlier revision number}';

    protected $description = 'Show a profile revision';

    public function handle(): int
    {
        $profile = Profile::byKey(ProfileKey::from((string) $this->argument('key')));
        $revision = $this->option('revision') === null
            ? ProfileRevision::currentOf($profile)
            : ProfileRevision::numbered(
                $profile,
                (int) $this->option('revision'),
            );

        $this->line("Profile {$profile->key}: {$profile->label}".($profile->isRetired() ? ' (retired)' : ''));
        $this->line("Revision: {$revision->revision}");
        $this->line("Starts from: {$revision->base->label}");
        $this->line("Model: {$revision->model}");
        $this->line('Skill allowlist: '.$this->allowlist($revision->skill_allowlist));
        $this->line(
            'Required skills: '.($revision->required_skills === [] ? 'none' : implode(
                ', ',
                $revision->required_skills,
            )),
        );
        $this->line('Instructions:');
        $this->line($revision->instructions);

        return self::SUCCESS;
    }

    /**
     * @param  list<string>|null  $allowlist
     */
    private function allowlist(array|null $allowlist): string
    {
        return match (true) {
            $allowlist === null => 'absent, every applicable skill',
            $allowlist === [] => 'empty, no skills',
            default => implode(', ', $allowlist),
        };
    }
}
