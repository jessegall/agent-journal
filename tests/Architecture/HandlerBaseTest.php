<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\CommandHandler;
use Illuminate\Support\Str;
use ReflectionClass;
use Symfony\Component\Finder\Finder;
use Tests\TestCase;

/**
 * Each domain has exactly one handler base, named for the domain in the singular plus CommandHandler, in its
 * Handlers/Support folder, and every concrete handler of the domain is final readonly and extends that base directly.
 */
final class HandlerBaseTest extends TestCase
{
    public function test_every_domain_handler_extends_its_domains_one_base_directly(): void
    {
        $faults = [];

        foreach (glob(base_path('domain/*/src/Handlers')) ?: [] as $folder) {
            $domain = basename(dirname($folder, 2));
            $base = "Domain\\{$domain}\\Handlers\\Support\\".Str::singular($domain).'CommandHandler';

            if (! class_exists($base) || ! new ReflectionClass($base)->isAbstract()
                || ! is_subclass_of($base, CommandHandler::class)) {
                $faults[] = "{$domain} has no abstract {$base} implementing CommandHandler";

                continue;
            }

            foreach (Finder::create()->files()->in($folder)->depth(0)->name('*Handler.php') as $file) {
                $handler = "Domain\\{$domain}\\Handlers\\".$file->getBasename('.php');
                $reflection = new ReflectionClass($handler);

                if (! $reflection->isFinal() || ! $reflection->isReadOnly()
                    || $reflection->getParentClass()?->getName() !== $base) {
                    $faults[] = "{$handler} must be final readonly and extend {$base} directly";
                }
            }
        }

        $this->assertSame([], $faults);
    }

    public function test_nothing_names_a_removed_authorization_piece(): void
    {
        $removed = '/\b(CommandAuthorization|ClassLevelAbilities|AuthorizedCommand|ResourceAreaType|AbilityGrant'
            .'|WithheldAbility|AbilityRequirement|AbilityNotWithheld|AbilityNotRegistered|ability_type'
            .'|authorizationOf|operationNamed|[A-Z][a-z]+Ability)\b|Attributes\\\\Operation\b/';
        $found = [];

        foreach (Finder::create()->files()->in([base_path('app'), base_path('domain')])->name('*.php') as $file) {
            if (preg_match($removed, $file->getContents(), $match) === 1) {
                $found[] = $file->getRelativePathname().': '.$match[0];
            }
        }

        $this->assertSame([], $found);
    }
}
