<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Bus\CommandHandler;
use App\Support\Reflector;
use Illuminate\Support\Str;
use Symfony\Component\Finder\Finder;

/**
 * Each domain has exactly one handler base, named for the domain in the singular plus CommandHandler, in its
 * Commands/Support folder, and every concrete handler of the domain is final readonly and extends that base directly.
 */
final class HandlerBaseTest extends TestCase
{
    public function test_every_domain_handler_extends_its_domains_one_base_directly(): void
    {
        $faults = [];

        foreach (glob(base_path('domain/*/src/Commands')) ?: [] as $folder) {
            $domain = basename(dirname($folder, 2));
            $base = "Domain\\{$domain}\\Commands\\Support\\".Str::singular($domain).'CommandHandler';

            $isBase = Reflector::find($base)
                ->filter(fn (Reflector $type) => $type->isClass() && $type->isAbstract())
                ->filter(fn (Reflector $type) => $type->isSubclassOf(CommandHandler::class))
                ->isDefined();

            if (! $isBase) {
                $faults[] = "{$domain} has no abstract {$base} implementing CommandHandler";

                continue;
            }

            foreach (Finder::create()->files()->in($folder)->depth(1)->notPath('Support')->name('*Handler.php') as $file) {
                /** @var class-string $handler */
                $handler = "Domain\\{$domain}\\Commands\\".$file->getRelativePath().'\\'.$file->getBasename('.php');
                $declaration = Reflector::of($handler);
                $extendsBase = $declaration->parent()
                    ->filter(fn (Reflector $parent) => $parent->name() === $base)
                    ->isDefined();

                if (! $declaration->isFinal() || ! $declaration->isReadOnly() || ! $extendsBase) {
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
