<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\CurrentActorSetter;
use App\Contracts\ShellAdmission;
use App\Enums\AdmissionRefusalCode;
use App\Enums\ShellDialect;
use App\Support\Rules\ShippedReaders;
use App\Support\ShippedReaderInstaller;
use App\Values\Admission;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;
use App\Values\OwnerAuthority;
use App\Values\ToolVersions;
use Tests\Support\Processes\RunsDirectLines;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A project whose installed tool is the version a shipped reader was proven on gets that reader approved through
 * the owner's own workflow, so the check is admitted; another version gets nothing and stays reader_required (doc 21
 * revision 6, sections 68 and 71).
 */
final class ShippedReaderInstallTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsDirectLines;

    private const string PHPSTAN = 'vendor/bin/phpstan analyse --error-format=json --no-progress';

    public function test_a_matching_installed_version_gets_its_shipped_reader_approved_and_the_check_admitted(): void
    {
        $this->assertSame(AdmissionRefusalCode::ReaderRequired, $this->refusalOf(self::PHPSTAN));

        $installed = $this->install(new ToolVersions(['composer.lock: phpstan/phpstan' => '2.3.6']));

        $this->assertSame(['phpstan'], $installed);
        $this->assertNull($this->refusalOf(self::PHPSTAN));
    }

    #[TimeLimit(seconds: 5, reason: 'It walks the whole approval workflow once for each of seven tools.')]
    public function test_every_tool_installed_here_gets_its_reader_and_its_check_admitted(): void
    {
        $installed = $this->install(ToolVersions::ofProject(base_path()));

        foreach (new ShippedReaders()->all() as $reader) {
            if (in_array($reader->tool, $installed, true)) {
                $this->assertNull($this->refusalOf($reader->invocation), $reader->invocation);
            }
        }

        $this->assertContains('phpunit', $installed);
    }

    public function test_another_installed_version_approves_nothing(): void
    {
        $installed = $this->install(new ToolVersions(['composer.lock: phpstan/phpstan' => '2.3.7']));

        $this->assertSame([], $installed);
        $this->assertSame(AdmissionRefusalCode::ReaderRequired, $this->refusalOf(self::PHPSTAN));
    }

    /**
     * @return list<string>
     */
    private function install(ToolVersions $versions): array
    {
        $this->app->forgetScopedInstances();
        $owner = TestActors::user(7);
        $this->app->make(CurrentActorSetter::class)->set($owner, new OwnerAuthority('test'));

        return $this->app->make(ShippedReaderInstaller::class)->install($versions, base_path());
    }

    private function refusalOf(string $line): AdmissionRefusalCode|null
    {
        $this->app->forgetScopedInstances();
        $this->start->startRequest($this->app);
        $admission = $this->app->make(ShellAdmission::class)->admit(
            $line,
            ShellDialect::Bash,
            ExecutionContext::inFolder(base_path()),
            bin2hex(random_bytes(8)),
        );

        return $admission instanceof Admission && $admission->decision instanceof AdmissionRefusal
            ? $admission->decision->code
            : null;
    }
}
