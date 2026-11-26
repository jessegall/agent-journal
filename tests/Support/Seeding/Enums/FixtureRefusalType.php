<?php

declare(strict_types=1);

namespace Tests\Support\Seeding\Enums;

/**
 * What the journal fixture refused, so a test asserts the refusal by its type and never by its words.
 */
enum FixtureRefusalType
{
    case NoOwner;
    case SecondOwner;
    case NoServerClock;
    case NoSink;
    case MissingAlias;
    case NotOneStart;
    case SelfShare;
    case OccupiedAlias;
    case DomainNotBooted;
    case Unregistered;
    case InvalidRegistrar;
    case Duplicate;
    case Foreign;
    case WrongResult;
    case WrongRecord;
    case HookReplayed;
    case NotOneFrame;
    case NoHookAnswer;
    case FreshNameTwice;
    case SettingValue;
    case NoTestHost;
}
